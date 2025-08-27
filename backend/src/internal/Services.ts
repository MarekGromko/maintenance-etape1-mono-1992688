/**
 * Services system to inject dependency and allow some level of IOC
 */
type Abstract    = abstract new(...args: any[]) => any;
type Constructor = new(...args: any[]) => any;
type Concrete<T extends Abstract> = new (...args: any[]) => InstanceType<T>; 

type ServicesHostBuilder = {
    addTransient<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder;
    addSingleton<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder;
    addScope<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder;
    build(): ServicesHost;
}
type ServiceDescriptor = {
    type: 'singleton' | 'transient' | 'scope',
    abstract: Abstract,
    constructor: Constructor,
    instance?: any
}

let __context: ServiceContext | null = null;

class ServiceContext{
    private criticalStack: Set<Constructor>[];
    public critical: Set<Constructor>;
    public scope: Map<Constructor, any>;
    readonly root: Constructor | Abstract;
    readonly host: ServicesHost;
    constructor(root: Constructor | Abstract, host: ServicesHost) {
        this.critical = new Set();
        this.criticalStack = [];
        this.scope = new Map();
        this.root = root;
        this.host = host;
    }
    public pushStack() {
        this.criticalStack.push(this.critical);
        this.critical = new Set(this.critical.values());
        return this;
    }
    public popStack() {
        this.critical = this.criticalStack.pop()!;
        return this;
    }
}
class ServicesHost{
    public services: Map<Abstract, ServiceDescriptor>;
    constructor(services: Iterable<ServiceDescriptor>) {
        this.services = new Map;
        for(let service of services) {
            this.services.set(service.abstract, {...service});
        }
    }
    /**
     * Instantiate the constructor & inject its dependance
     * @param abstract if the constructor is registered, then it will instantiate its implementation
     */
    make<A extends Abstract>(abstract: A): InstanceType<Concrete<A>>;
    make<C extends Constructor>(constructor: C): InstanceType<C> {
        if(__context !== null) 
            throw Error(`A Services is already trying to be resolved [${__context.root.name}] [${constructor.name}]`);
        __context = new ServiceContext(constructor, this);
        if(this.services.get(constructor)) 
            constructor = this.services.get(constructor)!.constructor as C;
        try {
            var instance = new constructor();
        } catch (error) {
            __context = null;
            throw error;
        } finally {
            __context = null;
        }
        return instance;
    }
}
/**
 * From the host, infer the implementation of the abstact class
 * @param abstract a registred abstract class
 * @returns the instance of the implementation
 */
function infer<A extends Abstract>(abstract: A): InstanceType<Concrete<A>> {
    if(__context === null) {
     throw Error(`Can not infer service [${abstract.name}] outisde the making of ServiceHost`);
    }
    const ctx = __context;
    const service = ctx.host.services.get(abstract);
    if(!service) 
        throw Error(`Service not found [${abstract.name}]`);

    switch(service.type) {
        case 'scope': {
            if(ctx.critical.has(service.constructor))
                throw Error(`A loop occured while trying to instantiate the scope service [${service.constructor.name}]`)
            let instance = ctx.scope.get(service.constructor);
            if(!instance) {
                ctx.pushStack();
                ctx.critical.add(service.constructor);
                instance = new service.constructor();
                ctx.scope.set(service.constructor, instance);
                ctx.popStack();
            }
            return instance;
        }
        case 'singleton': {
            if(ctx.critical.has(service.constructor))
                throw Error(`A loop occured while trying to instantiate the singleton service [${service.constructor.name}]`)
            if(!service.instance) {
                ctx.pushStack();
                ctx.critical.add(service.constructor);
                let instance = new service.constructor();
                ctx.popStack();
                service.instance = instance;
            }
            return service.instance;
        }
        case 'transient': {
            if(ctx.critical.has(service.constructor))
                throw Error(`A loop occured while trying to instantiate the transient service [${service.constructor.name}]`)
            ctx.pushStack();
            ctx.critical.add(service.constructor);
            let instance = new service.constructor();
            ctx.popStack();
            return instance;
        }
    }
}
/**
 * Builder for the host
 * @returns 
 */
function hostBuilder(): ServicesHostBuilder {
    let services = new Map<Abstract, ServiceDescriptor>();
    return {
        /**
         * Add a transient service
         * Transient service will greedily create a new instance of the dependancy every time it sees it
         * @param abstract 
         * @param constructor 
         * @returns 
         */
        addTransient<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder {
            services.set(abstract, { type: 'transient', abstract, constructor });
            return this;
        },
        /**
         * Add a singleton service
         * Singleton service's instances exists only once inside the livecycle of the host
         * @param abstract 
         * @param constructor 
         * @returns 
         */
        addSingleton<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder {
            services.set(abstract, { type: 'singleton', abstract, constructor });
            return this;
        },
        /**
         * Add a scope service
         * Scope service will be instantitate only once while making a dependency
         * @param abstract 
         * @param constructor 
         * @returns 
         */
        addScope<A extends Abstract>(abstract: A, constructor: Concrete<A>): ServicesHostBuilder {
            services.set(abstract, { type: 'scope', abstract, constructor });
            return this;
        },
        /**
         * Build the Services Host
         * @returns ServicesHost
         */
        build(): ServicesHost {
            return new ServicesHost(services.values());
        }
    }
}
const Services = {   
    infer,
    hostBuilder,
}
/* c8 ignore start */
export default Services;
export {
    Services,
    infer, 
    hostBuilder,
}
export type {
    ServicesHost,
    ServicesHostBuilder,
}