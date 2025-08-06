
export type Observer<T> = (value: T) => void;
export type Subscription = () => void;

export class Observable<T> {
  private observers: Observer<T>[] = [];
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  subscribe(observer: Observer<T>): Subscription {
    this.observers.push(observer);
  
    observer(this._value);
    
   
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  next(value: T): void {
    this._value = value;
    this.observers.forEach(observer => observer(value));
  }

  map<U>(mapper: (value: T) => U): Observable<U> {
    const mapped = new Observable(mapper(this._value));
    
    this.subscribe(value => {
      mapped.next(mapper(value));
    });
    
    return mapped;
  }

  filter(predicate: (value: T) => boolean): Observable<T> {
    const filtered = new Observable(this._value);
    
    this.subscribe(value => {
      if (predicate(value)) {
        filtered.next(value);
      }
    });
    
    return filtered;
  }

  combineLatest<U>(other: Observable<U>): Observable<[T, U]> {
    const combined = new Observable<[T, U]>([this._value, other._value]);
    
    const update = () => {
      combined.next([this._value, other._value]);
    };
    
    this.subscribe(update);
    other.subscribe(update);
    
    return combined;
  }
}

export class Subject<T> extends Observable<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  emit(value: T): void {
    this.next(value);
  }
}

import { useEffect, useState } from 'react';

export function useObservable<T>(observable: Observable<T>): T {
  const [value, setValue] = useState(observable.value);

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return subscription;
  }, [observable]);

  return value;
}

export function useSubject<T>(initialValue: T): [T, Subject<T>] {
  const [subject] = useState(() => new Subject(initialValue));
  const value = useObservable(subject);
  
  return [value, subject];
}


export function debounce<T>(observable: Observable<T>, delay: number): Observable<T> {
  const debounced = new Observable(observable.value);
  let timeoutId: NodeJS.Timeout;
  
  observable.subscribe(value => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debounced.next(value);
    }, delay);
  });
  
  return debounced;
}