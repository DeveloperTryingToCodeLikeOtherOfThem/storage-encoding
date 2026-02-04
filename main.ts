class Storage {
    buffer: Buffer;
    nextId: number;
    addressMap: { [key: string]: number };

    constructor(bufSize: number) {
        this.buffer = pins.createBuffer(bufSize)
        this.nextId = 0
        this.addressMap = {}
    }

    // Store a new "sprite" or other data
    store(name: string, data: number[]): number {
        if (this.addressMap[name] !== undefined) {
            throw "Name already exists: " + name
        }

        const offset = this.nextId
        this.addressMap[name] = offset
        this.nextId += data.length

        if (this.nextId > this.buffer.length) {
            throw "Buffer overflow"
        }

        // Write data into buffer
        for (let i = 0; i < data.length; i++) {
            this.buffer.setUint8(offset + i, data[i])
        }

        return offset
    }

    // Retrieve a "sprite" buffer by name
    get(name: string, size: number): Buffer {
        const offset = this.addressMap[name]
        if (offset === undefined) {
            throw "Name not found: " + name
        }

        return this.buffer.slice(offset, offset + size)
    }

    // Optional: read raw bytes as an array
    readBytes(name: string, size: number): number[] {
        const buf = this.get(name, size)
        const out: number[] = []
        for (let i = 0; i < size; i++) {
            out.push(buf.getUint8(i))
        }
        return out
    }
}
