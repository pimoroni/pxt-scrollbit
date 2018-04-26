#include "pxt.h"
using namespace pxt;

namespace scrollbit {
    //%
    int getFontDataByte(int index) {
        if(index < 0 || index >= 475){
            return 0;
        }
        MicroBitFont font = MicroBitFont::getSystemFont();
        return (char)*(font.characters + index);
    }
    //%
    int getCharWidth(int charCode) {
        if(charCode < MICROBIT_FONT_ASCII_START || charCode > MICROBIT_FONT_ASCII_END){
            return 5;
        }
        MicroBitFont font = MicroBitFont::getSystemFont();
        int offset = (charCode - MICROBIT_FONT_ASCII_START) * 5;
        uint8_t width = (uint8_t)*(font.characters + offset)
        | (uint8_t)*(font.characters + offset + 1)
        | (uint8_t)*(font.characters + offset + 2)
        | (uint8_t)*(font.characters + offset + 3)
        | (uint8_t)*(font.characters + offset + 4);

        if (width & 1) { return 5; }
        if (width & 2) { return 4; }
        if (width & 4) { return 3; }
        return 2;
    }
    //%
    Buffer getFontData(int charCode) {
        if(charCode < MICROBIT_FONT_ASCII_START || charCode > MICROBIT_FONT_ASCII_END){
            return ManagedBuffer(5).leakData();
        }
        MicroBitFont font = MicroBitFont::getSystemFont();
        int offset = (charCode - MICROBIT_FONT_ASCII_START) * 5;

        return ManagedBuffer((uint8_t *)(font.characters + offset), 5).leakData();
    }
}