export default class Store{
    store = new Map();

    setState(key, value){
        this.store.set(key, value)
    }

    getState(key){
        return this.store.get(key)
    }

}