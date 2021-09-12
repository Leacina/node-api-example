import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Account from '@modules/users/infra/typeorm/entities/Account';

@Entity('tb_cadastro_estabelecimento')
class Establishment {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  nm_estabelecimento: string;

  @Column()
  razao_social: string;

  @Column()
  cnpj_cpf: string;

  @Column()
  responsavel: string;

  @Column()
  telefone_responsavel: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  quantidade_lojas: number;

  @Column('timestamp')
  dh_inc: Date;
}

export default Establishment;
