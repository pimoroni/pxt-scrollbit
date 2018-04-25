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
    Buffer getFontData(int charCode) {
        if(charCode < MICROBIT_FONT_ASCII_START || charCode > MICROBIT_FONT_ASCII_END){
            return ManagedBuffer(5).leakData();
        }
        MicroBitFont font = MicroBitFont::getSystemFont();
        int offset = (charCode - MICROBIT_FONT_ASCII_START) * 5;

        return ManagedBuffer((uint8_t *)(font.characters + offset), 5).leakData();
    }
}