/**
 * Bluetooth Real-Time Sync Extension
 */
//% color="#0060AD" icon="\uf017" block="BT Clock"
namespace btClock {
    let _hours = 0
    let _minutes = 0

    /**
     * Start Bluetooth UART and listen for time data.
     * Expects format "HH:MM" followed by a newline.
     */
    //% block="start bluetooth time sync"
    export function startTimeSync() {
        bluetooth.startUartService()
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
            let data = bluetooth.uartReadString()
            _hours = parseInt(data.substr(0, 2))
            _minutes = parseInt(data.substr(3, 2))
        })
    }

    //% block="current hours"
    export function hours(): number { return _hours }

    //% block="current minutes"
    export function minutes(): number { return _minutes }
}

