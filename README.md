# Contacts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.

## Development server

Run `ng serve` for a dev server. Navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](https://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Run SonarQube scanning

    Generate the next command from project SonarQube and run in root folder (in the example "contact-manager-eap")

    ```bash
        sonar-scanner \
        -Dsonar.projectKey=contacts-manager-eaf \
        -Dsonar.sources=. \
        -Dsonar.host.url=https://sonarqube.cbaeneprojects.com/ \
        -Dsonar.login=e554bd71fcd509f2a3f7fba33f524d59bb5bd6c6
    ```