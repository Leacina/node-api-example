import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';
import Piece from '@modules/piece/infra/typeorm/entities/Piece';
import Budget from './Budget';

@Entity('tb_orcamento_item')
class BudgetItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  id_orcamento: number;

  @ManyToOne(() => Budget)
  @JoinColumn({ name: 'id_orcamento' })
  orcamento: Budget;

  @Column()
  id_peca: number;

  @ManyToOne(() => Piece)
  @JoinColumn({ name: 'id_peca' })
  peca: Piece;

  @Column()
  quantidade: number;

  @Column()
  valor: number;

  @Column()
  situacao: string;

  @Column()
  descricao_peca: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default BudgetItem;
