import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Shop from '@modules/establishment/infra/typeorm/entities/Shop';
import QuotationItem from './QuotationItem';

@Entity('tb_cotacao')
class Quotation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  id_estabelecimento: number;

  @ManyToOne(() => Establishment)
  @JoinColumn({ name: 'id_estabelecimento' })
  estabelecimento: Establishment;

  @Column()
  id_loja: number;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'id_loja' })
  loja: Shop;

  @OneToMany(() => QuotationItem, quotationItem => quotationItem.cotacao)
  items: QuotationItem[];

  @Column()
  emitente: string;

  @Column()
  emitente_email: string;

  @Column()
  emitente_telefone: string;

  @Column()
  situacao: string;

  @Column()
  identificador_cotacao: string;

  @Column()
  is_visualizado_cliente: number;

  @Column('timestamp')
  dh_inc: Date;

  valor_total: number;
}

export default Quotation;
