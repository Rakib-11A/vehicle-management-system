export declare class PasswordUtil {
    private static SALT_ROUNDS;
    static hash(password: string): Promise<string>;
    static compare(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=password.util.d.ts.map