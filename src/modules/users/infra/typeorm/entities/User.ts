import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Shop from '@modules/establishment/infra/typeorm/entities/Shop';
import Account from './Account';
import Perfil from './Perfil';

@Entity('tb_sistema_usuario')
class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  ds_login: string;

  @Column()
  nm_usuario: string;

  @Column()
  ds_senha: string;

  @Column()
  id_conta: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'id_conta' })
  conta: Account;

  @Column()
  id_perfil: number;

  @Column()
  is_ativo: string;

  @Column()
  tp_usuario: string;

  @Column()
  id_loja: number;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'id_loja' })
  loja: Shop;

  @ManyToOne(() => Perfil)
  @JoinColumn({ name: 'id_perfil' })
  perfil: Perfil;

  @Column()
  id_estabelecimento: number;

  @ManyToOne(() => Establishment)
  @JoinColumn({ name: 'id_estabelecimento' })
  estabelecimento: Establishment;

  @Column()
  telefone: string;
}

export default User;
