declare module '*.js'

declare module NodeJS  {
    interface Global {
        _test: any
    }
}
