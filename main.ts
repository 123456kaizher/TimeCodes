//% color="#0060AD" icon="\uf017" block="BT Clock"
namespace btClock {
    let _hours = 0
    let _minutes = 0
    let _lastSync = 0
    let _display: TM1637.TM1637LED = null

    /**
     * Initialize the 4-digit tube on specific pins.
     * @param clk Clock pin, eg: DigitalPin.P1
     * @param dio Data pin, eg: DigitalPin.P2
     */
    //% block="setup 4-digit display CLK %clk DIO %dio"
    export function setupDisplay(clk: DigitalPin, dio: DigitalPin) {
        _display = TM1637.create(clk, dio, 7, 4)
        _display.on()
    }

    //% block="start bluetooth time sync"
    export function startTimeSync() {
        bluetooth.startUartService()
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            let data = bluetooth.uartReadString().trim()
            if (data.length >= 5) {
                _hours = parseInt(data.substr(0, 2))
                _minutes = parseInt(data.substr(3, 2))
                _lastSync = control.millis()
                refreshDisplay()
            }
        })
    }

    function refreshDisplay() {
        if (_display) {
            _display.showNumber((_hours * 100) + _minutes)
            _display.showDP(1, true) // Show the colon
        }
    }

    //% block="current hours"
    export function hours(): number { updateTime(); return _hours }

    //% block="current minutes"
    export function minutes(): number { updateTime(); return _minutes }

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
            refreshDisplay()
        }
    }
}



