import { describe, it, test, expect } from '@jest/globals';
import {
    isValidAccountUsername,
    isValidEmail
} from '../src/utils/inputValidation';

describe('valid username input', () => {
    const cases = [
        // Valid cases
        ['johnsmith', true],
        ['john_smith', true],
        ['JohnSmith123', true],
        ['john_12345', true],
        ['a_b_c_d_e', true],
        ['user12345678901', true], // 15 chars
        ['A1_b2_C3', true],

        // Invalid cases
        ['john.smith', false],       // period not allowed
        ['john-smith', false],       // dash not allowed
        ['john smith', false],       // space not allowed
        ['jo', false],               // too short
        ['user1234567890123', false],// too long (17)
        ['john$mith', false],        // $ not allowed
        ['john!smith', false],       // ! not allowed
        ['john!smith ', false],       // spaces not allowed
        ['john! smith', false],       // spaces not allowed
    ];

    test.each(cases)('%s', (input, expected) => {
        expect(isValidAccountUsername(input)).toBe(expected);
    });
});

describe('valid email input', () => {
    const cases = [
        // Valid
        ['test@example.com', true],
        ['user.name@domain.com', true],
        ['user_name@domain.co', true],
        ['user-name@sub.domain.com', true],
        ['u@d.co', true],
        ['123456@numbers.org', true],
        ['firstname.lastname@domain.co.uk', true],
        ['email@localhost', false],
        ['test@123.123.123.123', false],

        // Invalid
        ['plainaddress', false],
        ['@missinglocal.com', false],
        ['username@', false],
        ['username@.com', false],
        ['username@domain..com', false],
        ['user name@domain.com', false],
        ['user<>name@domain.com', false],
        ['username@domain,com', false],
        ['.username@yahoo.com', false],
        ['username.@yahoo.com', false],
        ['', false]
    ];

    test.each(cases)('%s', (input, expected) => {
        expect(isValidEmail(input)).toBe(expected);
    });
});
