import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SerializedMap } from '../../common/racing/serialized-map';
import { Map } from '../../admin-screen/map-editor/map';
import { MockSerializedMaps } from '../../common/racing/mock-serialized-maps';

@Injectable()
export class MapService {

    public maps: Map[];
    private mockSerializedMaps: MockSerializedMaps = new MockSerializedMaps;

    constructor(private http: Http) {
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps';
        return this.http.post(url, JSON.stringify({map: serializedMap})).toPromise().then(() => null);
    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps/' + serializedMap.name;
        return this.http.put(url, JSON.stringify({serializedMap})).toPromise().then(() => null);
    }

    public delete(name: string): Promise<number[]> {
        const url = 'http://localhost:3000/racing/maps/' + name;
        return this.http.delete(url).toPromise().then(() => null);
    }

    public getMapNames(count: number): Promise<string[]> {
        return Promise.resolve(this.mockSerializedMaps.functionnalMaps().map((map: SerializedMap) => {
            return map.name;
        }));
    }

    public getByName(name: string): Promise<SerializedMap> {
        return Promise.resolve(this.mockSerializedMaps.functionnalMaps().find((map: SerializedMap) => {
            return (map.name === name);
        }));
    }

    // To be deleted ; mock method.
    public getMaps(): Promise<SerializedMap[]> {
        return Promise.resolve(this.mockSerializedMaps.functionnalMaps());
    }

}
