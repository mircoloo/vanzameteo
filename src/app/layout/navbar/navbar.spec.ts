import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();
  });

  it('should toggle the mobile menu', async () => {
    const el = fixture.nativeElement as HTMLElement;
    const collapse = el.querySelector('#mainNav')!;
    expect(collapse.classList).not.toContain('show');

    el.querySelector<HTMLButtonElement>('.navbar-toggler')!.click();
    await fixture.whenStable();
    expect(collapse.classList).toContain('show');
  });
});
