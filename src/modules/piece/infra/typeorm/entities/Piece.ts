import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Shop from '@modules/establishment/infra/typeorm/entities/Shop';
import Brand from '@modules/piece/infra/typeorm/entities/Brand';
import Model from '@modules/piece/infra/typeorm/entities/Model';
import Category from './Category';

@Entity('tb_cadastro_peca')
class Piece {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account | string;

  @Column()
  id_estabelecimento: number;

  @ManyToOne(() => Establishment)
  @JoinColumn({ name: 'id_estabelecimento' })
  estabelecimento: Establishment | string;

  @Column()
  id_loja: number;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'id_loja' })
  loja: Shop | string;

  @Column()
  id_marca: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'id_marca' })
  marca: Brand | string;

  @Column()
  id_modelo: number;

  @ManyToOne(() => Model)
  @JoinColumn({ name: 'id_modelo' })
  modelo: Model | string;

  @Column()
  id_categoria: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Category | string;

  @Column()
  nm_peca: string;

  @Column()
  descricao_peca: string;

  @Column()
  valor_peca: number;

  @Column()
  valor_peca_oficina: number;

  @Column()
  valor_peca_seguradora: number;

  @Column()
  qt_disponivel: number;

  @Column()
  qt_estoque: number;

  @Column()
  ano_inicial: number;

  @Column()
  ano_final: string;

  @Column()
  codigo_peca: string;

  @Column()
  altura: number;

  @Column()
  largura: number;

  @Column()
  comprimento: number;

  @Column()
  peso_bruto: number;

  @Column()
  cor: string;

  @Column()
  condicao_peca: string;

  @Column()
  ds_imagem: string;

  @Column()
  ds_imagem_dois: string;

  @Column()
  ds_imagem_tres: string;

  @Column()
  is_promocional: string;

  @Column()
  peca_destaque: number;

  @Column('timestamp')
  dh_inc: Date;
}

export default Piece;
