import { Container, decorate, injectable, interfaces } from 'inversify';
import { fluentProvide } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';
import 'reflect-metadata';

// Makes tsoa's Controller injectable
decorate(injectable(), Controller);

// Create a new container tsoa can use
const iocContainer = new Container();

type Identifier = string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>;

const ProvideSingleton = (identifier: Identifier) => fluentProvide(identifier).inSingletonScope().done();

const ProvideNamed = (identifier: Identifier, name: string) => fluentProvide(identifier).whenTargetNamed(name).done();

export { iocContainer, ProvideSingleton, ProvideNamed };
