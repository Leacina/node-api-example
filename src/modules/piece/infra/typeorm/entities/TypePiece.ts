import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_cadastro_tipo_peca')
class TypePiece {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;
}

export default TypePiece;
