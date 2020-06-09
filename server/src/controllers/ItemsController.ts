import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*'); //SELECT * FROM items
        
        const serializacaoItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://10.0.0.101:3333/uploads/${item.image}`, //URL DAS IMGS //http://localhost:3333/uploads/
            };
        });
    
        return response.json(serializacaoItems);
    }
}

export default ItemsController;