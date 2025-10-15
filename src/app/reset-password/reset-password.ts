import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ChangeEventType, ValidatorFn, Zinput } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zinput/zinput';
import { Zbutton } from '../ziadshalaby/ngx-zs-component/FormCompFolder/zbutton/zbutton';
import { Zform } from '../ziadshalaby/ngx-zs-component/zformService/zform-service';
import { AuthService } from '../services/auth-service';
import { ActivatedRoute } from '@angular/router';
import { Zcard } from '../ziadshalaby/ngx-zs-component/zcard/zcard';

@Component({
  selector: 'app-reset-password',
  imports: [Zinput, Zbutton, Zcard],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  readonly authService: AuthService = inject(AuthService)
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  readonly pass = viewChild<Zinput>('pass')
  readonly conf_pass = viewChild<Zinput>('conf_pass')

  readonly form = new Zform({
    new_password: '',
    conf_pass: '',
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    if(key === 'new_password') {
      this.conf_pass()?.forceChange()
    }
    else if (key === 'conf_pass') {
      this.pass()?.forceChange()
    }

    this.form.set(key, event.value, event.valid);

    console.log(this.form.getValues())
    console.log(this.form.getValidations())
    console.log(this.form.allFilled())

  }

  confPassValidate: ValidatorFn = (value: string | null) => {
    const conf_pass = this.form.get('new_password')
    if(conf_pass.value !== value) {
      return ['The passwords do not match.']
    }
    return []
  }

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.form.submit((values) => {
      const urlParams = this.activatedRoute.snapshot.paramMap
      const body = {
        new_password: values.new_password,
        uid: urlParams.get('uid'),
        token: urlParams.get('token'),
      }

      this.authService.passwordResetConfirmLoading.set(true);
      this.authService.passwordResetConfirm(body);
    })
  }
}
