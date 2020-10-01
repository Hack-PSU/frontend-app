type VoidCallback = () => unknown

// Copying Flutter vs. using MobX.
//
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
