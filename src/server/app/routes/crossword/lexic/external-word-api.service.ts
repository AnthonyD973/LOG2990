import * as http from 'http';

export class ExternalWordApiService {
    private static readonly API_KEY = '509a8efe219607991700e030dbd01768e4a6b86cfa513bcc9';
    private static readonly REQUEST_BASE: http.RequestOptions = {
        hostname: 'api.wordnik.com',
        port: '80',
        protocol: 'http:',
        method: 'GET',
        agent: false
    };

    private requestWordInfo(requestOptions: http.RequestOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            const REQUEST_OPTIONS: http.RequestOptions = {
                ...ExternalWordApiService.REQUEST_BASE,
                ...requestOptions
            };
            const req = http.request(REQUEST_OPTIONS);
            req.on('response', (res: http.IncomingMessage) => {
                let resp = '';
                res.on('data', (chunck: string) => resp += chunck);
                res.on('end', () => resolve(resp));
                res.on('error', reject);
            }).on('error', reject);
            req.end(); // Ends the request setup and sends it.
        });
    }

    public getDefinitions(word: string): Promise<string[]> {
        return this.requestWordInfo({
            path: `/v4/word.json/${word}/definitions` +
            '?limit=200&includeRelated=false&useCanonical=false&includeTags=false' +
            `&api_key=${ExternalWordApiService.API_KEY}`
        }).then((resp) => {
            const DEFINITIONS = JSON.parse(resp);
            if (Array.isArray(DEFINITIONS) && DEFINITIONS[0] && 'text' in DEFINITIONS[0]) {
                return ((DEFINITIONS as Array<any>)
                    .sort((a, b) => +a.sequence - +b.sequence)
                    .map((element) => <string>element.text));
            } else {
                throw DEFINITIONS;
            }
        });
    }

    public getFrequency(word: string): Promise<number> {
        return this.requestWordInfo({
            path: `/v4/word.json/${word}/frequency` +
            '?useCanonical=false&startYear=1800' +
            `&api_key=${ExternalWordApiService.API_KEY}`
        }).then((resp) => {
            const FREQUENCY = JSON.parse(resp);
            if ('totalCount' in FREQUENCY && Number.isFinite(FREQUENCY['totalCount'])) {
                return +FREQUENCY.totalCount;
            } else {
                throw FREQUENCY;
            }
        });
    }
}