declare module 'dompurify' {
  interface Config {
    ADD_ATTR?: string[];
    ADD_TAGS?: string[];
    ALLOW_ARIA_ATTR?: boolean;
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    FORBID_ATTR?: string[];
    FORBID_TAGS?: string[];
    KEEP_CONTENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_TRUSTED_TYPE?: boolean;
    SAFE_FOR_JQUERY?: boolean;
    SAFE_FOR_TEMPLATES?: boolean;
    SANITIZE_DOM?: boolean;
    WHOLE_DOCUMENT?: boolean;
    IN_PLACE?: boolean;
    USE_PROFILES?:
      | false
      | {
          mathMl?: boolean;
          svg?: boolean;
          svgFilters?: boolean;
          html?: boolean;
        };
  }

  interface Sanitize {
    (dirty: string | Node, config?: Config): string | Node;
  }

  const sanitize: Sanitize;

  export default sanitize;
}
