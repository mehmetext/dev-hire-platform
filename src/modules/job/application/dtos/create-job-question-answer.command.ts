export class CreateJobQuestionAnswerCommand {
  constructor(
    public readonly jobQuestionId: string,
    public readonly answer: string,
  ) {}
}
