import { Services }  from "../../src/internal/Services";
import { expect } from "chai";

describe("internal.Services", () => {
    abstract class AbstractService {}
    class ServiceImpl extends AbstractService {}
    class DoubleDeps {
        serviceA: AbstractService;
        serviceB: AbstractService;
        constructor() {
            this.serviceA = Services.infer(AbstractService);
            this.serviceB = Services.infer(AbstractService);
        }
    }

    it("should register a singleton service", () => {
        // arrange
        const builder = Services.hostBuilder();
        builder.addSingleton(AbstractService, ServiceImpl);
        const serviceHost = builder.build();

        // act
        const x = serviceHost.make(DoubleDeps);

        // assert
        expect(x.serviceA).to.be.an.instanceOf(ServiceImpl);
        expect(x.serviceB).to.be.equals(x.serviceA);
    })
    it("should register a transient service", () => {
        // arrange
        const builder = Services.hostBuilder();
        builder.addTransient(AbstractService, ServiceImpl);
        const serviceHost = builder.build();

        // act
        const x = serviceHost.make(DoubleDeps);

        // assert
        expect(x.serviceA).to.be.an.instanceOf(ServiceImpl);
        expect(x.serviceB).to.be.an.instanceOf(ServiceImpl);
        expect(x.serviceA).to.not.equal(x.serviceB);
    })
    it("should register a scope service", () => {
        // arrange
        const builder = Services.hostBuilder();
        builder.addScope(AbstractService, ServiceImpl);
        const serviceHostA = builder.build();
        const serviceHostB = builder.build();

        // act
        const a = serviceHostA.make(DoubleDeps);
        const b = serviceHostB.make(DoubleDeps);

        // assert
        expect(a.serviceA).to.be.equals(a.serviceB);
        expect(b.serviceA).to.be.equals(b.serviceB);
        expect(a.serviceA).to.not.equal(b.serviceA);
    })
    it("should switch to abstract if make parameter is abstract", () =>{
        // arrange 
        const builder = Services.hostBuilder();
        builder.addScope(AbstractService, ServiceImpl);
        const host = builder.build();

        // act
        let instance = host.make(AbstractService);

        // assert
        expect(instance).to.be.an.instanceOf(ServiceImpl);
    })

    it("throws if infer inexistent service", ()=>{
        // arrange
        const builder = Services.hostBuilder();
        const serviceHost = builder.build();

        // act
        const fn = () => serviceHost.make(DoubleDeps);

        // assert
        expect(fn).to.throw(Error);
    })
    it("throws if recursive service make", () => {
        // arrange
        const builder = Services.hostBuilder();
        builder.addScope(AbstractService, ServiceImpl);
        const serviceHost = builder.build();
        class MakeInService {
            constructor() {
                let y = serviceHost.make(MakeInService);
            }
        }

        // act
        const fn = () => serviceHost.make(MakeInService);

        // assert
        expect(fn).to.throw(Error);
    })
    it("throws if we infer outside of service host",  () => {
        // act
        let fn = () => Services.infer(AbstractService);

        // assert
        expect(fn).to.throw(Error);
    })

    abstract class AbstractLoop{}
    class ConcreteLoop extends AbstractLoop{
        constructor() {
            super();
            Services.infer(AbstractLoop);
        }
    }

    it("throws if loop in singleton host make", ()=>{
        // arrange
        const builder = Services.hostBuilder();
        builder.addSingleton(AbstractLoop, ConcreteLoop);
        const serviceHost = builder.build();

        // act
        const fn = () => serviceHost.make(ConcreteLoop);

        // assert
        expect(fn).to.throw(Error);
    })
    it("throws if loop in singleton host make", ()=>{
        // arrange
        const builder = Services.hostBuilder();
        builder.addScope(AbstractLoop, ConcreteLoop);
        const serviceHost = builder.build();

        // act
        const fn = () => serviceHost.make(ConcreteLoop);

        // assert
        expect(fn).to.throw(Error);
    })
    it("throws if loop in transient host make", ()=>{
        // arrange
        const builder = Services.hostBuilder();
        builder.addTransient(AbstractLoop, ConcreteLoop);
        const serviceHost = builder.build();

        // act
        const fn = () => serviceHost.make(ConcreteLoop);

        // assert
        expect(fn).to.throw(Error);
    })
});

