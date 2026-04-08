import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

import { ApodItem } from '../model/apod-item.model';
import { NasaService } from './nasa';

describe('NasaService', () => {
  let service: NasaService;
  let httpMock: HttpTestingController;

  const sampleImage: ApodItem = {
    date: '2024-01-01',
    title: 'Sample image',
    url: 'https://example.com/image.jpg',
    explanation: 'Sample explanation',
    media_type: 'image'
  };

  const sampleVideo: ApodItem = {
    date: '2024-01-02',
    title: 'Sample video',
    url: 'https://example.com/video.mp4',
    explanation: 'Sample video explanation',
    media_type: 'video'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }); // No es necesario compilar componentes ya que no hay ninguno en este servicio

    service = TestBed.inject(NasaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería solicitar el APOD por fecha', () => {
    service.getApodByDate('2024-01-01').subscribe((apod) => {
      expect(apod).toEqual(sampleImage);
    });

    const request = httpMock.expectOne(
      'https://api.nasa.gov/planetary/apod?api_key=zdUP8ElJv1cehFM0rsZVSQN7uBVxlDnu4diHlLSb&date=2024-01-01'
    );

    expect(request.request.method).toBe('GET');
    request.flush(sampleImage);
  });

  it('debería recoger solo imágenes para los últimos APODs', async () => {
    const responses: Array<Observable<ApodItem>> = [
      throwError(() => new Error('boom')),
      of(sampleVideo),
      of({ ...sampleImage, date: '2024-01-02' }),
      of({ ...sampleImage, date: '2024-01-03' })
    ];

    let callIndex = 0;
    const calledDates: string[] = [];
    (service as unknown as {
      getApodByDate: (date: string) => Observable<ApodItem>;
    }).getApodByDate = (date: string) => {
      calledDates.push(date);
      return responses[callIndex++];
    };

    const apods = await firstValueFrom(service.getLastImageApods(2));

    expect(apods).toEqual([
      { ...sampleImage, date: '2024-01-02' },
      { ...sampleImage, date: '2024-01-03' }
    ]);
    expect(callIndex).toBe(4);
    expect(calledDates.length).toBe(4);
  });

  it('debería encontrar una imagen de reemplazo que no esté en las fechas excluidas', async () => {
    const responses: Array<Observable<ApodItem>> = [
      of({ ...sampleImage, date: '2024-01-01' }),
      of({ ...sampleImage, date: '2024-01-02' }),
      of({ ...sampleImage, date: '2024-01-03' })
    ];

    let callIndex = 0;
    (service as unknown as {
      getApodByDate: (date: string) => Observable<ApodItem>;
    }).getApodByDate = () => responses[callIndex++];

    const apod = await firstValueFrom(service.getReplacementImage(['2024-01-01', '2024-01-02']));

    expect(apod).toEqual({ ...sampleImage, date: '2024-01-03' });
    expect(callIndex).toBe(3);
  });
});
