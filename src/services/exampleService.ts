import Service, { useService, PersistModeType } from "./Service";

interface IExampleService {
  isDarkMode: boolean;
}

class ExampleService extends Service<IExampleService> {
  constructor() {
    /**
     * Add a unique instance name and persist type to enable persistence
     * temp = session storage, perm = local storage, default is set to temp
     * */
    super("exampleService", PersistModeType.Perm);

    this.context = {
      isDarkMode: false,
    };
  }

  // Method to mutate the context
  toggleDarkMode() {
    this.context.isDarkMode = !this.context.isDarkMode;
  }
}

// instantiate the class
const exampleService = new ExampleService();

// declare a usehook
export const useExampleService = (): {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
} => {
  const { isDarkMode } = useService(
    exampleService,
    (context: IExampleService) => context
  );

  const toggleDarkMode = () => {
    exampleService.toggleDarkMode();
  };

  return { isDarkMode, toggleDarkMode };
};
