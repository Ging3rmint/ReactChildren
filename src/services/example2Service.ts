import Service, { useService, PersistModeType } from "./Service";

interface IExample2Service {
  counter: number;
}

class Example2Service extends Service {
  constructor() {
    super("example2Service", PersistModeType.Temp);

    this.context = {
      counter: 0,
    };
  }

  increaseCounter() {
    this.context.counter += 1;
  }
}

const example2Service = new Example2Service();

export const useExample2Service = () => {
  const { counter } = useService(
    example2Service,
    (context: IExample2Service) => context
  );

  const increaseCounter = () => {
    example2Service.increaseCounter();
  };

  return { counter, increaseCounter };
};
