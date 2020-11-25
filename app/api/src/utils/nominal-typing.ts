/**
 * Brand
 * A brand uses typescript's nominal-typing to create a new type out of a simpler type
 * It takes as it's generic input the type to be branded, and the type (usually a string const)
 * with which to brand it.
 *
 * This can be useful when you want e.g. a string or number to have a specific meaning.
 *
 * @example
 * type UserId = Brand<number, 'user'>;
 *
 * // this errors, because a UserId is not a number anymore:
 * const myUserId: UserId = 1;
 *
 * // this doesn't error since we're casting.  See createBrander or asBrand to stop cheating
 * const myUserId: UserId = 1 as UserId;
 *
 * type PostId = Brand<number, 'post'>
 * function printPostId(id: PostId) {
 *   conole.log(id);
 * }
 *
 * // this errors
 * printPostId(myUserId);
 */
export type Brand<Base, Branding, BrandingKey extends string = '__brand'> = {
  [T in BrandingKey]: Branding;
} & { __identity: Base };

export type AnyBrand = Brand<any, any>;

/**
 * BaseOf
 * The BaseOf type returns the type that was branded by the Brand type;
 *
 * @example
 * type UserId = Brand<number, 'user'>;
 * type UserIdBase = BaseOf<UserId>;
 *
 * // this doesn't error
 * const myUserIdRaw: UserIdBase = 1;
 */
export type BaseOf<B extends AnyBrand> = B['__identity'];

/**
 * Brander
 * Brander is a type of a function that takes in the base of a Brand
 * and returns it as the Brand
 *
 * @see asBrand
 * @see createBrander
 */
export type Brander<B extends AnyBrand> = (initial: BaseOf<B>) => B;

/**
 * asBrand
 * Takes the base value of a brand and converts it to a Brand type
 * @param initial the base value that you want to convert to a brand
 *
 * @example
 * type UserId = Brand<number, 'user'>;
 * const myUserId: UserId = asBrand<UserId>(1);
 */
export function asBrand<B extends AnyBrand>(initial: BaseOf<B>): B {
  return initial as B;
}

/**
 * createBrander
 * A function factory that creates a personalized asBrand
 *
 * @example
 * type UserId = Brand<number, 'user'>;
 * const asUserId = createBrander<UserId>();
 * const myUserId: UserId = asUserId(1);
 */
export function createBrander<B extends AnyBrand>(): Brander<B> {
  return asBrand;
}
