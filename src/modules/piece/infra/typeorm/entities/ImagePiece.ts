import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Piece from './Piece';

@Entity('tb_imagem_produto')
class ImagePiece {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  imagem: string;

  @Column()
  id_produto: number;

  @ManyToOne(() => Piece)
  @JoinColumn({ name: 'id_produto' })
  produto: Piece;

  @Column('timestamp')
  dh_inc: Date;
}

export default ImagePiece;
