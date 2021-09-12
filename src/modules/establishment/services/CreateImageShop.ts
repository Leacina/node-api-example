import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/uploadImageShop';
import { injectable, inject } from 'tsyringe';
import Shop from '../infra/typeorm/entities/Shop';
import IShopsRepository from '../repositories/IShopsRepository';

interface IRequest {
  shop_id: number;
  file: string;
}

@injectable()
class CreateImageShopService {
  constructor(
    @inject('ShopsRepository')
    private shopsRepository: IShopsRepository,
  ) {}

  public async execute({ shop_id, file }: IRequest): Promise<Shop> {
    const shop = await this.shopsRepository.findById(Number(shop_id));

    if (shop.imagem_loja) {
      const pieceFilePath = path.join(uploadConfig.directory, shop.imagem_loja);

      try {
        const pieceAvatarFileExists = await fs.promises.stat(pieceFilePath);

        if (pieceAvatarFileExists) {
          await fs.promises.unlink(pieceFilePath);
        }
      } catch (error) {
        shop.imagem_loja = '';
      }
    }

    shop.imagem_loja = file;

    await this.shopsRepository.save(shop);

    return shop;
  }
}

export default CreateImageShopService;
