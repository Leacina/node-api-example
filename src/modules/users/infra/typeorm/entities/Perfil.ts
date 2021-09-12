import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_sistema_perfil')
class Perfil {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  tp_perfil: string;

  @Column()
  cd_perfil: number;

  @Column()
  nm_menu: string;

  @Column('timestamp')
  dh_inc: Date;
}

export default Perfil;
