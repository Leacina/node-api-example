import { inject, injectable } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import INotificationsRepository from '@modules/users/repositories/INotificationsRepository';
import IBudgetItemsRepository from '../repositories/IBudgetItemsRepository';
import BudgetItem from '../infra/typeorm/entities/BudgetItem';
import IBudgetsRepository from '../repositories/IBudgetsRepository';

interface IRequest {
  budget_item_id: number;
  isConfirm: boolean;
}

@injectable()
export default class UpdateBudgetItemProcessService {
  constructor(
    @inject('BudgetItemsRepository')
    private budgetItemsRepository: IBudgetItemsRepository,

    @inject('BudgetsRepository')
    private budgetsRepository: IBudgetsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    budget_item_id,
    isConfirm,
  }: IRequest): Promise<BudgetItem> {
    const budgetItem = await this.budgetItemsRepository.process({
      budget_item_id,
      isConfirm,
    });

    // Verifica se a cotação foi finalizada
    const budget = await this.budgetsRepository.findById(
      Number(budgetItem.id_orcamento),
      {
        id_conta: 0,
        id_estabelecimento: 0,
        id_loja: 0,
      },
    );

    if (budget) {
      // Se já foi confirmado envia o email
      if (budget.situacao === 'VI' || budget.situacao === 'VP') {
        const createQuotationTemplate = path.resolve(
          __dirname,
          '..',
          'views',
          'budget_create.hbs',
        );

        // eslint-disable-next-line no-await-in-loop
        this.mailProvider
          .sendMail({
            to: {
              name: budget.emitente,
              email: budget.emitente_email,
            },
            subject: '[BATEU] Orçamento finalizado',
            templateData: {
              file: createQuotationTemplate,
              variable: {
                title: 'Orçamento finalizado!',
                text_info: `Você tem um orçamento finalizada pela loja ${budget.loja.nm_loja}. Para mais detalhes, acesse o Bateu.`,
              },
            },
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    return budgetItem;
  }
}
