import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Budget from '@modules/budget/infra/typeorm/entities/Budget';
import Quotation from '@modules/quotation/infra/typeorm/entities/Quotation';

@Entity('tb_notificacao')
class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  mensagem: string;

  @Column()
  id_usuario: number;

  @Column()
  id_orcamento: number;

  @ManyToOne(() => Budget)
  @JoinColumn({ name: 'id_orcamento' })
  orcamento: Budget;

  @Column()
  id_cotacao: number;

  @ManyToOne(() => Quotation)
  @JoinColumn({ name: 'id_cotacao' })
  cotacao: Quotation;

  @Column()
  id_loja: number;

  @Column()
  is_visualizado: number;
}

export default Notification;
