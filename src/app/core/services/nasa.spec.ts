import { TestBed } from '@angular/core/testing';

import { Nasa } from './nasa';

describe('Nasa', () => {
  let service: Nasa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nasa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
