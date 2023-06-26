import { Observable , throwError } from 'rxjs';
export class HttpRequestHelper {
    static handleError(response: Response) : Observable<any> {
        return throwError(response || 'Server error');
    }
}