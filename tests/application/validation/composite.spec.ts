import { MockProxy, mock } from "jest-mock-extended";

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (
    private readonly validators: Validator[]
  ) {}

  validate (): undefined {

  }
}

describe("ValidationComposite", () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeAll(() => {
    validator1 = mock();
    validator1.validate.mockReturnValue(undefined);
    validator2 = mock();
    validator2.validate.mockReturnValue(undefined);
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  it("should return undefined if all validators return undefined", () => {
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
