import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        // cidade, uf, items (Query Params)
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim())); //trim: Remover espaçamento

        const points = await knex('points') //Buscando todos os pontos
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems) //.whereIn: Está dentro
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct() //Pontos de coleta distintos
        .select('points.*');
    
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://10.0.0.101:3333/uploads/${point.image}`, 
            };
        });    

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first(); //PONTO DE COLETA

        if(!point) {
            return response.status(400).json({ message: 'Point not found.'});
        }

        const serializedPoint = {
                ...point,
                image_url: `http://10.0.0.101:3333/uploads/${point.image}`, 
        }; 

        /*
            SELECT * FROM items
            JOIN point_items ON items.id = point_items.item_id
            WHERE point_item.point.id = {id}
        */

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');

        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) { //PONTO DE COLETA
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction(); //Transação
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const idsInseridos = await trx('points').insert(point);
    
        const point_id = idsInseridos[0];
    
        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        })
    
        await trx('point_items').insert(pointItems);
        
        await trx.commit(); //Fazer os insert no banco de dados, Depois que utilizar transaction().

        return response.json({
            id: point_id,
            ... point,
        });
    }
}

export default PointsController;