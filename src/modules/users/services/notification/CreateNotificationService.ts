// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import * as yup from 'yup';
import AppError from '@shared/errors/AppError';

import Notification from '../../infra/typeorm/entities/Notification';
import INotificationsRepository from '../../repositories/INotificationsRepository';
import ICreateNotificationDTO from '../../dtos/ICreateNotificationDTO';

@injectable()
class CreateNotificationService {
  /**
   * Realiza a injeção de dependencia de acordo com a pasta Provider.
   * @param notificationsRepository
   */
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    id_cotacao,
    id_orcamento,
    mensagem,
    id_usuario,
  }: ICreateNotificationDTO): Promise<Notification> {
    // Validações necessárias para criar a notificcao
    const schema = yup.object().shape({
      mensagem: yup
        .string()
        .nullable(true)
        .required('Nenhuma mensagem foi informada'),
    });

    // Caso houver algum erro retorna com status 422
    await schema
      .validate({
        mensagem,
      })
      .catch(err => {
        throw new AppError(err.message, 422);
      });

    // Cria a notificao
    const perfil = await this.notificationsRepository.create({
      id_cotacao,
      id_orcamento,
      mensagem,
      id_usuario,
    });

    return perfil;
  }
}

export default CreateNotificationService;
