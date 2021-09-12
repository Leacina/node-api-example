import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';
import Quotation from './Quotation';

@Entity('tb_cotacao_item')
class QuotationItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  id_cotacao: number;

  @ManyToOne(() => Quotation)
  @JoinColumn({ name: 'id_cotacao' })
  cotacao: Quotation;

  @Column()
  quantidade_peca: number;

  @Column()
  valor_peca: number;

  @Column()
  identificador_cotacao: string;

  @Column()
  descricao_peca: string;

  @Column()
  situacao: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default QuotationItem;
