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
import BudgetItem from './BudgetItem';

@Entity('tb_orcamento')
class Budget {
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

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.orcamento)
  items: BudgetItem[];

  @Column()
  emitente: string;

  @Column()
  emitente_email: string;

  @Column()
  emitente_telefone: string;

  @Column()
  situacao: string;

  @Column('timestamp')
  dh_inc: Date;

  valor_total: number;
}

export default Budget;
