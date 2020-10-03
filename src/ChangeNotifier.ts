type VoidCallback = () => unknown

// https://api.flutter.dev/flutter/foundation/ChangeNotifier-class.html
export default class ChangeNotifier {
    private _listeners: VoidCallback[] = []

    get hasListeners() {
        return !!this._listeners.length
    }

    addListener(listener: VoidCallback) {
        this._listeners.push(listener)
    }

    removeListener(listener: VoidCallback) {
        this._listeners.splice(this._listeners.indexOf(listener), 1)
    }

    notifyListeners() {
        for (const listener of this._listeners) {
            listener()
        }
    }
}

// https://api.flutter.dev/flutter/foundation/ValueNotifier-class.html
export class ValueNotifier<T> extends ChangeNotifier {
    _value: T

    get value() {
        return this._value
    }

    set value(val: T) {
        this._value = val
        this.notifyListeners()
    }

    constructor(initialValue: T) {
        super()
        this._value = initialValue
    }
}
