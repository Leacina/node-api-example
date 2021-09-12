import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_sistema_conta')
class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nm_conta: string;

  @Column()
  is_ativo: string;

  @Column()
  is_anuncio: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default Account;
