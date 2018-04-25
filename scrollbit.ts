namespace smbus {
    export function writeByte(addr: number, register: number, value: number): void {
        let temp = pins.createBuffer(2);
        temp[0] = register;
        temp[1] = value;
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function writeBuffer(addr: number, register: number, value: Buffer): void {
        let temp = pins.createBuffer(value.length + 1);
        temp[0] = register;
        for (let x = 0; x < value.length; x++) {
            temp[x + 1] = value[x];
        }
        pins.i2cWriteBuffer(addr, temp, false);
    }
    export function readBuffer(addr: number, register: number, len: number): Buffer {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadBuffer(addr, len, false);
    }
    function readNumber(addr: number, register: number, fmt: NumberFormat = NumberFormat.UInt8LE): number {
        let temp = pins.createBuffer(1);
        temp[0] = register;
        pins.i2cWriteBuffer(addr, temp, false);
        return pins.i2cReadNumber(addr, fmt, false);
    }
}

//% weight=100 color=#000000 icon="\uf00a"
namespace scrollbit {
    const I2C_ADDR: number = 0x74
    const REG_MODE: number = 0x00
    const REG_FRAME: number = 0x01
    const REG_AUDIOSYNC: number = 0x06
    const REG_SHUTDOWN: number = 0x0a

    const REG_COLOR: number = 0x24
    const REG_BLINK: number = 0x12
    const REG_ENABLE: number = 0x00

    const REG_BANK: number = 0xfd
    const BANK_CONFIG: number = 0x0b

    const COLS: number = 17
    const ROWS: number = 7

    const GAMMA: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
        2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
        6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 11, 11,
        11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18,
        19, 19, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 27, 28,
        29, 29, 30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 37, 38, 39, 40,
        40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54,
        55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 88, 89,
        90, 91, 93, 94, 95, 96, 98, 99, 100, 102, 103, 104, 106, 107, 109, 110,
        111, 113, 114, 116, 117, 119, 120, 121, 123, 124, 126, 128, 129, 131, 132, 134,
        135, 137, 138, 140, 142, 143, 145, 146, 148, 150, 151, 153, 155, 157, 158, 160,
        162, 163, 165, 167, 169, 170, 172, 174, 176, 178, 179, 181, 183, 185, 187, 189,
        191, 193, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220,
        222, 224, 227, 229, 231, 233, 235, 237, 239, 241, 244, 246, 248, 250, 252, 255]

    let buf: Buffer = pins.createBuffer(144)
    let frame: number = 0

    function pixelAddr(col: number, row: number): number {
        row = 7 - (row + 1)

        if (col > 8) {
            col = col - 8
            row = 6 - (row + 8)
        } else {
            col = 8 - col
        }

        return (col * 16) + row
    }

    /**
     * Setup scroll:bit,
     * must be called before using the display
     */
    export function setup(): void {
        clear()
        smbus.writeByte(I2C_ADDR, REG_BANK, BANK_CONFIG)

        control.waitMicros(1000)
        smbus.writeByte(I2C_ADDR, REG_SHUTDOWN, 0)
        control.waitMicros(1000)
        smbus.writeByte(I2C_ADDR, REG_SHUTDOWN, 1)
        control.waitMicros(1000)

        smbus.writeByte(I2C_ADDR, REG_MODE, 0)
        smbus.writeByte(I2C_ADDR, REG_AUDIOSYNC, 0)

        let enable = pins.createBuffer(17)
        enable.fill(255)
        smbus.writeByte(I2C_ADDR, REG_BANK, 0)
        smbus.writeBuffer(I2C_ADDR, 0, enable)
        smbus.writeByte(I2C_ADDR, REG_BANK, 1)
        smbus.writeBuffer(I2C_ADDR, 0, enable)
    }

    /**
     * TODO: Get some GUI/UX magic for this
     * Set all the pixels on scroll:bit using
     * a text string. Brightness = charCode.
     * eg ' ' = 32, 'z' = 122
     */
    //% block
    export function showLeds(leds: string): void {
        leds = leds.substr(0, COLS * ROWS)
        for (let x = 0; x < leds.length; x++) {
            let brightness = leds.charCodeAt(x);
            let col = x % COLS
            let row = (x - col) / COLS
            setPixel(col, row, brightness)
        }
        show()
    }

    /**
     * Set a single pixel on scroll:bit
     * @param col - column to set (0-16)
     * @param row - row to set (0-6)
     * @param brightness - brightness to set (0-255)
     */
    //% blockId=scrollbit_set_pixel
    //% block="set pixel|at col %col| row %row|to %brightness"
    //% col.min=0 col.max=16
    //% row.min=0 row.max=6
    //% brightness.min=0 brightness.max=255
    export function setPixel(col: number, row: number, brightness: number): void {
        buf[pixelAddr(col, row)] = Math.clamp(0, 255, brightness)
    }

    /**
     * Get a single pixel on scroll:bit,
     * returns a brightness value (0-255)
     * @param col - column to get (0-16)
     * @param row - row to get (0-6)
     */
    //% blockId=scrollbit_get_pixel
    //% block="get pixel|at col %col| row %row"
    export function getPixel(col: number, row: number): number {
        return buf[pixelAddr(col, row)]
    }

    /**
     * Clear scroll:bit,
     * sets all pixels to 0, but does not update display
     */
    //% block
    export function clear(): void {
        buf.fill(0)
    }

    /**
     * Update scroll:bit,
     * update the display with your pretty pixels
     */
    //% block
    export function show(): void {
        let corrected_buf: Buffer = pins.createBuffer(144)

        for (let x = 0; x < buf.length; x++) {
            corrected_buf[x] = GAMMA[buf[x]]
        }

        smbus.writeByte(I2C_ADDR, REG_BANK, frame)
        smbus.writeBuffer(I2C_ADDR, REG_COLOR, corrected_buf)
        smbus.writeByte(I2C_ADDR, REG_BANK, BANK_CONFIG)
        smbus.writeByte(I2C_ADDR, REG_FRAME, frame)

        frame = frame == 0 ? 1 : 0
    }

    /**
     * Return the width (number of cols) of scroll:bit
     */
    //% block
    export function cols(): number {
        return COLS
    }

    /**
     * Return the height (number of rows) of scroll:bit
     */
    //% block
    export function rows(): number {
        return ROWS
    }
}

scrollbit.setup();