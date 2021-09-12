import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';

@Entity('tb_cadastro_categoria')
class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  categoria: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default Category;
