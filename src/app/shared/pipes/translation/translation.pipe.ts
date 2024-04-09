import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../services/language/language.service';

@Pipe({
  name: 'translate',
})
export class TranslationPipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(key: string): string {
    return this.languageService.getTranslation(key);
  }
}
