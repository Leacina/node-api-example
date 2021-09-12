import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity('tb_sistema_usuario_token')
class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column()
  user_id: number;

  @Column('timestamp')
  dh_inc: Date;
}

export default User;
