import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import Account from '@modules/users/infra/typeorm/entities/Account';

@Entity('tb_cadastro_loja')
class Shop {
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
  nm_loja: string;

  @Column()
  cnpj_cpf: string;

  @Column()
  cidade: string;

  @Column()
  bairro: string;

  @Column()
  pais: string;

  @Column()
  cep: string;

  @Column()
  endereco: string;

  @Column()
  numero: string;

  @Column()
  complemento: string;

  @Column()
  fone_principal: string;

  @Column()
  fone_whats: string;

  @Column()
  fone_skype: string;

  @Column()
  email: string;

  @Column()
  imagem_loja: string;

  @Column()
  estado: string;

  @CreateDateColumn()
  dh_inc: Date;
}

export default Shop;
