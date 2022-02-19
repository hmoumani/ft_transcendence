import {Component, EventEmitter, Output} from "@angular/core";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {OAuthService} from "../oauth.service";

@Component({
  selector: 'two-factor-auth',
  templateUrl: 'two-factor-auth.component.html',
  styleUrls: ['two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent {

  private readonly code: string;
  // public is2FA = false;
  public loading = false;
  public is2FA = false;
  @Output() fail = new EventEmitter();

  constructor(private http: HttpClient, private route: ActivatedRoute, public oauthService: OAuthService, private router: Router) {
    this.code = route.snapshot.queryParams['code'];
    console.log("2FA");
    this.oauthService.generateAccessToken(this.code).subscribe({
      error: err => {
        if (err.error['2FA']) {
          this.is2FA = true;
        } else {
          this.fail.emit();
          router.navigate(['login']);
        }
      }
    });
  }

  verify(twoFactorAuth: NgForm) {
    let twoFactorAuthCode = twoFactorAuth.value['twoFactorAuth'];
    console.log(twoFactorAuth);
    this.loading = true;
    this.oauthService.generateAccessToken(this.code, twoFactorAuthCode).subscribe({
      next: value => {
        this.oauthService.enable2FA();
      },
      error: (err: HttpErrorResponse) => {
        twoFactorAuth.controls['twoFactorAuth'].setErrors(err.error);
        this.loading = false;
      }
    });
  }
}
