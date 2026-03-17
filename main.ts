//% color="#0060AD" icon="\uf017" block="BT Clock"
namespace btClock {
    let _hours = 0
    let _minutes = 0
    let _lastSync = 0

    //% block="start bluetooth time sync"
    export function startTimeSync() {
        bluetooth.startUartService()
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            let data = bluetooth.uartReadString().trim()
            if (data.length >= 5) {
                _hours = parseInt(data.substr(0, 2))
                _minutes = parseInt(data.substr(3, 2))
                _lastSync = control.millis()
            }
        })
    }

    //% block="current hours"
    export function hours(): number {
        updateTime()
        return _hours
    }

    //% block="current minutes"
    export function minutes(): number {
        updateTime()
        return _minutes
    }

    function updateTime() {
        if (_lastSync == 0) return;
        let elapsed = control.millis() - _lastSync
        if (elapsed >= 60000) {
            let minsToAdd = Math.idiv(elapsed, 60000)
            _minutes += minsToAdd
            _lastSync += minsToAdd * 60000
            while (_minutes >= 60) {
                _minutes -= 60
                _hours = (_hours + 1) % 24
            }
        }
    }
}


