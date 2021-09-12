import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from './User';

@Entity('tb_cliente')
class UserLegalInfo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  id_usuario: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column()
  razao_social: string;

  @Column()
  nome_fantasia: string;

  @Column()
  cnpj: string;

  @Column()
  inscricao_estadual: string;

  @Column()
  endereco: string;

  @Column()
  telefone: string;

  @Column()
  email: string;

  @Column()
  site: string;

  @Column()
  responsavel: string;

  @Column()
  cpf_responsavel: string;

  @Column()
  celular_responsavel: string;

  @Column()
  email_responsavel: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default UserLegalInfo;
